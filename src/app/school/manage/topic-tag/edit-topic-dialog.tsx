import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { renderIcon } from '../../../../components/utils';
import IconPickerDialog from './select-icons';

interface EditTopicDialogProps {
    open: boolean; // 弹窗是否打开
    onClose: () => void; // 关闭弹窗的回调
    onSubmit: (topic: { name: string; iconsName: string; order: number }) => void; // 提交表单的回调
    topic: { name: string; iconsName: string; order: number }; // 初始数据
}

export default function EditTopicDialog({ open, onClose, onSubmit, topic }: EditTopicDialogProps) {
    const [name, setName] = useState(topic.name); // 标签名称
    const [icon, setIcon] = useState(topic.iconsName); // 标签图标
    const [order, setOrder] = useState(topic.order); // 标签排序序号
    const [iconPickerOpen, setIconPickerOpen] = useState(false); // 图标选择弹窗状态

    // 提交表单
    const handleSubmit = () => {
        if (name) {
            onSubmit({ name, iconsName: icon, order });
            onClose();
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>编辑主题</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="主题名称"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="排列序号"
                        fullWidth
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                    />
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            选择图标
                        </Typography>
                        <Button variant="outlined" onClick={() => setIconPickerOpen(true)}>
                            {icon ? renderIcon(icon) : "选择图标"}
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>取消</Button>
                    <Button onClick={handleSubmit} color="primary">保存</Button>
                </DialogActions>
            </Dialog>

            {/* 图标选择弹窗 */}
            <IconPickerDialog
                open={iconPickerOpen}
                onClose={() => setIconPickerOpen(false)}
                onSelect={(iconName) => setIcon(iconName)}
            />
        </>
    );
}