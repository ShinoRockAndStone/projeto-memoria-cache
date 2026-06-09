import { useRef, type ChangeEvent } from "react";
import { Modal, UploadProps, message, Button } from "antd";
import { usePrograms } from "../../contexts/programs.tsx";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import { FileArchive } from "lucide-react";

type FileManagerModalProps = {
  open: boolean;
  onClose: () => void;
  onProgramSelect: (programName: string) => void;
};

// TODO add DnD feature to reorder caches?
export const FileManagerModal = ({
  open,
  onClose,
  onProgramSelect,
}: FileManagerModalProps) => {
  const { programs, setPrograms } = usePrograms();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const uploaderProps: UploadProps = {
    name: "file",
    fileList: [],
    beforeUpload: async (file) => {
      // Check file extension
      if (!file.name.endsWith(".json")) {
        messageApi.error("Only JSON files are supported.");
        return false;
      }
      try {
        const raw = await file.text();
        const json = JSON.parse(raw);
        // TODO validate the parsed content
        const instructions = json.map(
          (instruction: Record<string, string>) => instruction,
        );
        setPrograms({ ...programs, [file.name]: instructions });
      } catch (e) {
        messageApi.error("Invalid JSON file.");
        return false;
      }
      return false; // Prevent auto-upload
    },
  };

  const handleCFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".c")) {
      messageApi.error("Only C source files (.c) are supported.");
      event.target.value = "";

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      messageApi.success("File uploaded successfully.");

      console.log("Upload response:", data);

      await pollJobStatus(data.jobId, file.name);
    } catch (error) {
      console.error(error);

      messageApi.error("Failed to upload C file.");
    } finally {
      event.target.value = "";
    }
  };

  const pollJobStatus = async (jobId: string, fileName: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch job status");
        }

        const job = await response.json();

        console.log("Job status:", job.status);

        if (job.status === "completed") {
          clearInterval(interval);

          messageApi.success("Processing completed successfully.");

          console.log(job);

          const instructions = job.simulation.accesses;
          setPrograms({ ...programs, [fileName]: instructions });
          onProgramSelect(fileName);
          onClose();

          return;
        }

        if (job.status === "failed") {
          clearInterval(interval);

          messageApi.error("Processing failed.");

          console.log(job);

          return;
        }
      } catch (error) {
        clearInterval(interval);

        console.error(error);

        messageApi.error("Error while checking job status.");
      }
    }, 2000);
  };

  return (
    <>
      <Modal
        title="Program manager"
        open={open}
        onCancel={onClose}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ hidden: true }}
      >
        {contextHolder}
        <Dragger {...uploaderProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to start parsing</p>
          <p className="ant-upload-hint">
            Only TracerGrind texttrace dumps are supported!
          </p>
        </Dragger>

        <div className="flex flex-col mt-4 gap-2">
          <Button type="primary" onClick={() => fileInputRef.current?.click()}>
            Upload C file
          </Button>
          <input
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            accept=".c"
            className="hidden"
            onChange={handleCFileChange}
          />
        </div>

        <ul className="flex flex-col mt-4 gap-2">
          {Object.entries(programs).map(([name, instructions]) => (
            <li
              key={name}
              className="flex gap-4 px-4 py-2 items-center bg-gray-100 rounded-lg"
            >
              <FileArchive className="text-gray-500" />
              <div className="flex-grow">
                <h3>{name}</h3>
                <span className="text-xs text-gray-700">
                  {instructions.length} instructions
                </span>
              </div>
              {/*TODO implement trash*/}
              {/*<Trash className="text-gray-500"/>*/}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};
