import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
} from "antd";
import dayjs from "dayjs"; // Import dayjs để xử lý ngày giờ

const CreateIssueModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => void; // Bạn có thể thay thế `any` bằng kiểu dữ liệu cụ thể nếu cần
}> = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values); // Truyền toàn bộ giá trị từ form
        message.success("Issue created successfully!");
        form.resetFields(); // Reset form sau khi tạo
        onClose(); // Đóng modal
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form khi hủy
    onClose(); // Đóng modal
  };

  return (
    <Modal
      title="Create New Issue"
      open={visible}
      footer={null} // Loại bỏ footer mặc định của Modal
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          createdDate: dayjs().format("YYYY-MM-DD"), // Giá trị mặc định là hôm nay
          updatedDate: dayjs().format("YYYY-MM-DD"), // Giá trị mặc định là hôm nay
        }}
      >
        {/* Type */}
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select>
            <Select.Option value="Bug">Bug</Select.Option>
            <Select.Option value="Feature">Feature</Select.Option>
            <Select.Option value="Task">Task</Select.Option>
          </Select>
        </Form.Item>

        {/* Priority */}
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select a priority!" }]}
        >
          <Select>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Assignee */}
        <Form.Item
          label="Assignee"
          name="assignee"
          rules={[{ required: true, message: "Please select an assignee!" }]}
        >
          <Select>
            <Select.Option value="John Doe">John Doe</Select.Option>
            <Select.Option value="Alice Johnson">Alice Johnson</Select.Option>
          </Select>
        </Form.Item>

        {/* Reporter */}
        <Form.Item
          label="Reporter"
          name="reporter"
          rules={[{ required: true, message: "Please select a reporter!" }]}
        >
          <Select>
            <Select.Option value="Jane Smith">Jane Smith</Select.Option>
            <Select.Option value="Bob Brown">Bob Brown</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      {/* Custom Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleCreate}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default CreateIssueModal;