"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import {
    TreeItem2Content,
    TreeItem2IconContainer,
    TreeItem2GroupTransition,
    TreeItem2Label,
    TreeItem2Root,
    TreeItem2Checkbox,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import AddIcon from '@mui/icons-material/Add';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { grey } from '@mui/material/colors'; // 导入 MUI 的颜色
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
}));

interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> { }

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
    return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(
    props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
    return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
    return <MenuBookOutlinedIcon {...props} sx={{ opacity: 0.8 }} />;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        status,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()}>
                    <TreeItem2IconContainer {...getIconContainerProps()}>
                        <TreeItem2Icon status={status} />
                    </TreeItem2IconContainer>
                    <TreeItem2Checkbox {...getCheckboxProps()} />
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TreeItem2Label {...getLabelProps()} />
                        <IconButton aria-label="delete" size="small" onClick={(e) => { e.stopPropagation() }}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </CustomTreeItemContent>
                {children && <TreeItem2GroupTransition sx={{
                    marginLeft: 2,
                    borderLeft: `1px dashed ${alpha(grey[500], 0.4)}`,
                }} {...getGroupTransitionProps()} />}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});



export default function HeadlessAPI() {
    const expandedItems = ['1', '2', '3', '4', '5', '6']
    return (
        <Box sx={{ minHeight: 200, minWidth: 250 }}>
            <SimpleTreeView defaultExpandedItems={['3']} slots={{
                expandIcon: ExpandIcon,
                collapseIcon: CollapseIcon,
                endIcon: EndIcon,
            }}>
                <CustomTreeItem itemId="1" label="Amelia Hart">
                    <CustomTreeItem itemId="2" label="Jane Fisher" />
                </CustomTreeItem>
                <CustomTreeItem itemId="3" label="Bailey Monroe">
                    <CustomTreeItem itemId="4" label="Freddie Reed" />
                    <CustomTreeItem itemId="5" label="Georgia Johnson">
                        <CustomTreeItem itemId="6" label="Samantha Malone" />
                    </CustomTreeItem>
                </CustomTreeItem>
            </SimpleTreeView>
        </Box>
    );
}
