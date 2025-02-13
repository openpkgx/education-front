import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Grid2,
    IconButton,
    CircularProgress,
    TextField,
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import * as MUIIcons from '@mui/icons-material'; // 导入所有图标

// IconPickerDialog 组件
export default function IconPickerDialog(props: {
    open: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void; // 修改为传递图标名称
}) {
    const { open, onClose, onSelect } = props;

    // 图标列表和搜索关键字
    const [icons, setIcons] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 延迟加载图标列表
    useEffect(() => {
        if (open) {
            // 只加载带有 "Outlined" 后缀的图标
            // const iconList = Object.keys(MUIIcons).filter(
            //     (key) => key.endsWith('Outlined') // 过滤出 Outlined 图标
            // );
            // setIcons(iconList);

            import('@mui/icons-material').then((module) => {
                const iconList = Object.keys(module).filter(
                    (key) => key.endsWith('Outlined') // 过滤出 Outlined 图标
                );
                setIcons(iconList);
            });
        }
    }, [open]);

    // 根据搜索关键字过滤图标
    const filteredIcons = useMemo(() => {
        return icons.filter((iconName) =>
            iconName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [icons, searchTerm]);

    // 选择图标
    const handleSelectIcon = useCallback(
        (iconName: string) => {
            onSelect(iconName); // 传递图标名称
            onClose(); // 选择图标后关闭弹窗
        },
        [onSelect, onClose]
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                选择图标
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* 搜索框 */}
                <TextField
                    fullWidth
                    placeholder="搜索图标..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                {/* 图标列表 */}
                {filteredIcons.length === 0 ? (
                    <CircularProgress />
                ) : (
                    <Grid2 container spacing={2}>
                        {filteredIcons.map((iconName) => {
                            // const Icon = React.lazy(() =>
                            //     import(`@mui/icons-material/${iconName}`).then((module) => ({
                            //         default: module.default, // 确保返回的是默认导出
                            //     }))
                            // );
                            const Icon = MUIIcons[iconName as keyof typeof MUIIcons]; // 获取图标组件
                            return (
                                <Grid2 key={iconName}>
                                    <IconButton onClick={() => handleSelectIcon(iconName)}>
                                        <Icon fontSize="large" />
                                    </IconButton>
                                    {/* <div className='flex text-xs'>{iconName}</div> */}
                                </Grid2>
                            );
                        })}
                    </Grid2>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
}