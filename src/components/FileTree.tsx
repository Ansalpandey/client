import React, { useState, useEffect } from "react";
import {
  Tree,
  Input,
  Modal,
  Button,
  ConfigProvider,
  Menu,
  Dropdown,
  Row,
  Col,
} from "antd";
import type { TreeProps, TreeDataNode } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { DirectoryTree } = Tree;

interface DirectoryItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

interface ExtendedTreeDataNode extends TreeDataNode {
  isLeaf?: boolean;
  title: string;
  path?: string;
  children?: ExtendedTreeDataNode[];
}

interface FileTreeProps {
  onFileClick: (fileExtension: string, content: string, path: string) => void;
}

export default function FileTree({ onFileClick }: FileTreeProps) {
  const [treeData, setTreeData] = useState<ExtendedTreeDataNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<ExtendedTreeDataNode | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [currentPath, setCurrentPath] = useState<string>(""); // Track current path
  const [isCreating, setIsCreating] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchDirectoryContents(""); // Root directory
    setCurrentPath("");
  }, []);

  useEffect(() => {
    const fetchFileContent = async (path: string) => {
      try {
        const response = await axios.get("http://localhost:8080/api/read", {
          params: { path },
        });
        const content = response.data.content;
        const fileExtension = path.split(".").pop() || "txt";
        onFileClick(fileExtension, content, path);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    };
  
    const findFirstFileNode = (
      data: ExtendedTreeDataNode[]
    ): ExtendedTreeDataNode | null => {
      // Recursively find the first file node in the tree
      for (const node of data) {
        if (node.isLeaf) {
          return node; // Return the first file node found
        }
        if (node.children) {
          const fileNode = findFirstFileNode(node.children);
          if (fileNode) return fileNode;
        }
      }
      return null; // No file found
    };
  
    if (
      treeData.length > 0 &&
      currentPath === ""
    ) {
      // Only open the first file when we are at the root directory
      const firstFileNode = findFirstFileNode(treeData);
      if (firstFileNode) {
        // Fetch and display the content of the first file
        fetchFileContent(firstFileNode.path!);
        setSelectedNode(firstFileNode);
      }
    }
  }, [treeData, currentPath]);

  const fetchDirectoryContents = async (
    path: string,
    parentKey?: React.Key
  ) => {
    try {
      const response = await axios.get("http://localhost:8080/api/list", {
        params: { path },
      });
      const data: DirectoryItem[] = response.data;

      const formattedData = data.map((item) => ({
        key: item.path.replace(/\\/g, "/"), // Normalize path to use forward slashes
        title: item.name,
        isLeaf: !item.isDirectory,
        path: item.path,
        children: item.isDirectory ? [] : undefined,
      }));

      if (parentKey) {
        // Update the tree data recursively to add children to the parent node
        const updateTreeData = (
          nodes: ExtendedTreeDataNode[]
        ): ExtendedTreeDataNode[] => {
          return nodes.map((node) => {
            if (node.key === parentKey) {
              return { ...node, children: formattedData };
            }
            if (node.children) {
              return { ...node, children: updateTreeData(node.children) };
            }
            return node;
          });
        };
        setTreeData((prevData) => updateTreeData(prevData));
      } else {
        // If no parentKey, set the root data
        setTreeData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching directory contents:", error);
    }
  };

  const fetchFileContent = async (path: string) => {
    try {
      const response = await axios.get("http://localhost:8080/api/read", {
        params: { path },
      });
      const content = response.data.content;
      const fileExtension = path.split(".").pop() || "txt";
      onFileClick(fileExtension, content, path);
    } catch (error) {
      console.error("Error reading file:", error);
    }
    
  };

  const onSelect: TreeProps["onSelect"] = (_, info) => {
    const selectedNode = info.node as ExtendedTreeDataNode;
    setSelectedNode(selectedNode);

    if (selectedNode.isLeaf) {
      // Fetch and display file content
      fetchFileContent(selectedNode.path!);
    } else {
      // Fetch and display directory contents
      fetchDirectoryContents(selectedNode.path!, selectedNode.key);
      setCurrentPath(selectedNode.path!); // Update the current path when navigating to a folder
    }
};

const onExpand: TreeProps["onExpand"] = (_, info) => {
    const expandedNode = info.node as ExtendedTreeDataNode;
    if (!expandedNode.isLeaf && expandedNode.children?.length === 0) {
      // Fetch and update the tree data for the expanded folder
      fetchDirectoryContents(expandedNode.path!, expandedNode.key);
    }
};

  const handleRename = (node: ExtendedTreeDataNode) => {
    setSelectedNode(node);
    setIsEditing(true);
    setEditValue(node.title as string);
  };

  const handleDelete = async (node: ExtendedTreeDataNode) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      onOk: async () => {
        try {
          await axios.delete("http://localhost:8080/api/delete", {
            params: { path: node.path },
          });
          const deleteNode = (
            data: ExtendedTreeDataNode[],
            key: React.Key
          ): ExtendedTreeDataNode[] => {
            return data.filter((item) => {
              if (item.key === key) return false;
              if (item.children) {
                item.children = deleteNode(item.children, key);
              }
              return true;
            });
          };
          setTreeData((prevData) => deleteNode(prevData, node.key));
          setSelectedNode(null);
        } catch (error) {
          console.error("Error deleting file/folder:", error);
        }
      },
    });
  };

  const handleEditConfirm = async () => {
    if (selectedNode) {
      try {
        await axios.post("http://localhost:8080/api/rename", {
          oldPath: selectedNode.path,
          newPath: selectedNode.path?.replace(
            selectedNode.title as string,
            editValue
          ),
        });
        const updateNode = (
          data: ExtendedTreeDataNode[],
          key: React.Key,
          title: string
        ): ExtendedTreeDataNode[] => {
          return data.map((node) => {
            if (node.key === key) {
              return { ...node, title };
            }
            if (node.children) {
              node.children = updateNode(node.children, key, title);
            }
            return node;
          });
        };
        setTreeData((prevData) =>
          updateNode(prevData, selectedNode.key, editValue)
        );
        setIsEditing(false);
        setSelectedNode(null);
      } catch (error) {
        console.error("Error renaming file/folder:", error);
      }
    }
  };

  const handleCreate = async (type: "file" | "folder") => {
    if (!selectedNode) return;

    // If the node is a file (leaf), get the parent path
    const parentPath = selectedNode.isLeaf
      ? selectedNode.path?.split("/").slice(0, -1).join("/") // Remove the last segment for a file
      : selectedNode.path; // If it's a folder, just use the path

    // Ensure you have the root directory at the beginning (e.g., "D:\\Work\\TradingLibrary")
    const rootPath = "D:\\Work\\Spring Boot\\SpringSecurityDB"; // Root directory

    // Construct the new path by joining rootPath with the new name
    const newPath = `${rootPath}${
      parentPath ? "\\" + parentPath : ""
    }\\${newName}`;

    try {
      // Make the request for creating a file or folder
      if (type === "file") {
        await axios.post("http://localhost:8080/api/createFile", {
          path: newPath,
        });
      } else {
        await axios.post("http://localhost:8080/api/createFolder", {
          path: newPath,
        });
      }

      // After creating, fetch the directory contents again
      fetchDirectoryContents(rootPath, selectedNode.key);
      setIsCreating(null);
      setNewName("");
      console.log("Constructed Path:", newPath);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
    }
  };

  const renderTitle = (node: ExtendedTreeDataNode) => {
    const menu = (
      <Menu>
        <Menu.Item key="rename" onClick={() => handleRename(node)}>
          Rename
        </Menu.Item>
        <Menu.Item key="delete" onClick={() => handleDelete(node)}>
          Delete
        </Menu.Item>
        {!node.isLeaf && (
          <>
            <Menu.Item key="createFile" onClick={() => setIsCreating("file")}>
              Create File
            </Menu.Item>
            <Menu.Item
              key="createFolder"
              onClick={() => setIsCreating("folder")}
            >
              Create Folder
            </Menu.Item>
          </>
        )}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {node.isLeaf ? (
              <FileOutlined style={{ marginRight: 8 }} />
            ) : (
              <FolderOutlined style={{ marginRight: 8 }} />
            )}
            <span>{node.title}</span>
          </div>
          <div style={{ marginLeft: "8px" }} className="node-actions">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "white" }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleRename(node);
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "white" }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node);
              }}
            />
            {!node.isLeaf && (
              <Button
                type="text"
                icon={<PlusOutlined style={{ color: "white" }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreating("file");
                }}
              />
            )}
          </div>
        </div>
      </Dropdown>
    );
  };

  const processedTreeData = treeData.map((node) => ({
    ...node,
    title: renderTitle(node),
    children: node.children
      ? node.children.map((child) => ({ ...child, title: renderTitle(child) }))
      : undefined,
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Tree: {
            directoryNodeSelectedBg: "#2b3245",
            directoryNodeSelectedColor: "#fff",
            colorBgContainer: "#161d2d",
            colorText: "#fff",
            borderRadius: 6,
          },
        },
      }}
    >
      <div style={{ height: "100%", backgroundColor: "black" }}>
        {isEditing && (
          <Modal
            title="Rename"
            open={isEditing}
            onOk={handleEditConfirm}
            onCancel={() => setIsEditing(false)}
          >
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </Modal>
        )}
        {isCreating && (
          <Modal
            title={`Create ${isCreating === "file" ? "File" : "Folder"}`}
            open={!!isCreating}
            onOk={() => handleCreate(isCreating)}
            onCancel={() => setIsCreating(null)}
          >
            <Input
              placeholder={`Enter ${
                isCreating === "file" ? "file" : "folder"
              } name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Modal>
        )}
        <Row
          style={{
            padding: "8px",
            backgroundColor: "#1f1f1f",
            borderBottom: "1px solid #333",
          }}
        >
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreating("file")}
              style={{ marginRight: "8px" }}
            >
              Create File
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreating("folder")}
            >
              Create Folder
            </Button>
          </Col>
        </Row>
        <DirectoryTree
          multiple
          defaultExpandAll={false}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={processedTreeData}
          className="h-full p-6"
          style={{ height: "100%", overflow: "auto" }}
          showIcon={false}
        />
      </div>
    </ConfigProvider>
  );
}
