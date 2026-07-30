import { Button, Form, Input } from "antd";

export default function JoinOrgForm() {
  const [form] = Form.useForm();

  const onFinish = (values: { inviteCode: string }) => {
    // wire to joinOrganization mutation here
    console.log(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item
        label={<span className="font-inter font-medium text-brand-heading">Invite code</span>}
        name="inviteCode"
        rules={[{ required: true, message: "Enter the code your manager shared with you" }]}
      >
        <Input
          size="large"
          placeholder="e.g. RIVER-7F2K"
          className="font-inter uppercase tracking-wider"
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