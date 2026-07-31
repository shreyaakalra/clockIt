"use client"

import { useUser } from "@auth0/nextjs-auth0";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";

export default function JoinOrgForm() {
  const [form] = Form.useForm();
  const {user} = useUser();
  const router = useRouter();

  const onFinish = async(values: { name: string, inviteCode: string }) => {

    if(!user) return;

    const orgResponse = await fetch('/api/graphql', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        query: `
          query($inviteCode: String!){
            organizationByInviteCode(inviteCode: $inviteCode){
              id
            }
          }
        `,
        variables: {inviteCode: values.inviteCode}
      })
    })

    const orgResult = await orgResponse.json();

    if(orgResult.errors){
      console.log(orgResult.errors);
      return;
    }

    const org = orgResult.data.organizationByInviteCode;

    if(!org){
      console.log("The organisation doesn't exist. Please check your invite code.")
      return;
    }

    const userResponse = await fetch('/api/graphql', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        query: `
          mutation($authId: String!, $email: String!, $name: String!, $role: Role!, $organizationId: Int!){
            addNewUser(authId: $authId, email: $email, name: $name, role: $role, organizationId: $organizationId){
              id
              role
            }
          }
        `, 
        variables: {
          authId: user.sub,
          email: user.email,
          name: values.name,
          role: "CARE_WORKER",
          organizationId: org.id
        }
      })
    });

    const userResult = await userResponse.json();

    if(userResult.errors){
      console.log(userResult.errors);
      return;
    }

    router.push('/dashboard');


  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item
        label={
          <span className="font-inter font-medium text-brand-heading">
            Name
          </span>
        }
        name="name"
        rules={[{
          required: true,
          message: "Please enter your name"
        }]}
      >
        <Input
          size="large"
          placeholder="Enter your name"
          className="font-inter tracking-wider"
        />
      </Form.Item>
      <Form.Item
        label={<span className="font-inter font-medium text-brand-heading">Invite code</span>}
        name="inviteCode"
        rules={[{ required: true, message: "Enter the code your manager shared with you" }]}
      >
        <Input
          size="large"
          placeholder="e.g. RIVER-7F2K"
          className="font-inter tracking-wider"
        />
      </Form.Item>

      <p className="text-xs text-brand-muted mb-6 -mt-2">
        Ask your manager for this code if you don&apos;t have it yet.
      </p>

      <Button
        htmlType="submit"
        type="primary"
        size="large"
        block
        className="bg-brand-primary border-brand-primary font-inter font-medium"
      >
        Join organization
      </Button>
    </Form>
  );
}