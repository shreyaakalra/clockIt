"use client"
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

export default function CreateOrgForm() {

  const [form] = Form.useForm();
  const router = useRouter();
  const {user, isLoading} = useUser();

  const onFinish = async (values: {orgName: string, name: string}) => {
    if(!user) return;

    const orgResponse = await fetch('/api/graphql', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        query: `
          mutation($name: String!){
            createOrganization(name: $name){
              id
              name
              inviteCode
            }
          }
        `,
        variables: {name: values.orgName}
      })
    });

    const orgResult = await orgResponse.json();

    if(orgResult.errors){
      console.log(orgResult.errors);
      return;
    }

    const org = orgResult.data.createOrganization;

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
          role: "MANAGER",
          organizationId: org.id
        },
      }),
    });

    const userResult = await userResponse.json();

    if(userResult.errors){
      console.error(userResult.errors);
      return;
    }

    router.push("/manager/dashboard");
  }

  
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>

      <Form.Item
        label={
          <span className="font-inter font-medium text-brand-heading">
            Name
          </span>
        }
        name="name"
        rules={[{required: true, message: "Please Enter your name"}]}
      >
        <Input 
          size="large"
          placeholder="Enter your name"
          className="font-inter"
        />
      </Form.Item>
        
      <Form.Item
        label={
        <span className="font-inter font-medium text-brand-heading">
          Organization name
        </span>
        }
        name="orgName"
        rules={[{ required: true, message: "Give your organization a name" }]}
      >
        <Input
          size="large"
          placeholder="e.g. Riverside Care Home"
          className="font-inter"
        />
      </Form.Item>

      <p className="text-xs text-brand-muted mb-6 -mt-2">
        You&apos;ll be set up as the manager. You can invite your team and set clock-in locations right after.
      </p>

      <Button
        htmlType="submit"
        type="primary"
        size="large"
        block
        className="bg-brand-primary border-brand-primary font-inter font-medium"
      >
        Create organization
      </Button>
    </Form>
  );
}