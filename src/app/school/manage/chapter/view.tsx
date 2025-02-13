"use client";
import React, { useState } from 'react';

// 定义树节点的数据结构类型
interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
}

// 定义组件的 props 类型
interface ChapterTreeViewProps {
    initialData: TreeNode[];
}

function ChapterTreeView({ initialData }: ChapterTreeViewProps) {
    const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

    // 切换节点展开/折叠状态
    const toggleNode = (nodeId: string) => {
        setExpandedNodes((prevExpanded) =>
            prevExpanded.includes(nodeId)
                ? prevExpanded.filter(id => id !== nodeId)
                : [...prevExpanded, nodeId]
        );
    };

    // 更新树结构的辅助函数
    const updateTree = (nodes: TreeNode[], updater: (node: TreeNode) => TreeNode | null): TreeNode[] => {
        return nodes.map(node => {
            const updatedNode = updater(node);
            if (updatedNode === null) return null; // 如果返回null，则表示该节点被移除

            if (updatedNode.children) {
                updatedNode.children = updateTree(updatedNode.children, updater);
            }
            return updatedNode;
        }).filter(node => node !== null) as TreeNode[];
    };

    // 添加新节点到指定父节点
    const addNode = (parentId: string | undefined) => {
        setTreeData((prevData) => {
            const newNodeId = `${parentId}-${Math.random().toString(36).substr(2, 9)}`;
            const newNode: TreeNode = { id: newNodeId, label: `New Child of ${parentId || 'Root'}` };

            return updateTree(prevData, (node) => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        children: [
                            ...(node.children || []),
                            newNode
                        ]
                    };
                }
                return node;
            });
        });
    };

    // 删除指定节点及其子节点
    const deleteNode = (nodeId: string) => {
        setTreeData((prevData) => {
            return updateTree(prevData, (node) => {
                if (node.id === nodeId) {
                    return null; // 移除匹配的节点
                }
                if (node.children) {
                    node.children = node.children.filter(child => child.id !== nodeId); // 移除直接子节点
                }
                return node;
            });
        });

        // 确保已展开的节点列表中不包含被删除的节点
        setExpandedNodes((prevExpanded) => prevExpanded.filter(id => id !== nodeId));
    };

    // 渲染树结构
    const renderTree = (nodes: TreeNode[]) => (
        <ul className="list-none p-0">
            {nodes.map((node) => (
                <li key={node.id} className="mb-2 relative">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleNode(node.id)}>
                        <span className="flex items-center space-x-2">
                            <span className="text-lg">{expandedNodes.includes(node.id) ? '▽' : '▶'}</span>
                            <span className="font-semibold">{node.label}</span>
                        </span>
                        <div className="flex space-x-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={(e) => { e.stopPropagation(); addNode(node.id); }}>Add</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}>Delete</button>
                        </div>
                    </div>
                    {node.children && (
                        <div
                            className={`pl-4 mt-2 overflow-hidden  transition-all duration-300 transform ease-in-out ${expandedNodes.includes(node.id) ? 'max-h-full' : 'max-h-0'}`}
                        >
                            <ul className="list-none p-0">
                                {renderTree(node.children)}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return <div className="p-4">{renderTree(treeData)}</div>;
}

const initialTreeData: TreeNode[] = [
    {
        id: '1',
        label: 'Root Node 1',
        children: [
            { id: '1.1', label: 'Child Node 1.1' },
            { id: '1.2', label: 'Child Node 1.2' }
        ]
    },
    {
        id: '2',
        label: 'Root Node 2',
        children: [
            {
                id: '2.1',
                label: 'Child Node 2.1',
                children: [
                    { id: '2.1.1', label: 'Grandchild Node 2.1.1' }
                ]
            }
        ]
    }
];

export default function ChapterPage() {
    return (
        <ChapterTreeView initialData={initialTreeData}></ChapterTreeView>
    );
}