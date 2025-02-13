import { Topic } from "@/api/dto";
import { renderIcon } from "@/components/utils";
import { Box, Typography } from "@mui/material";

export interface RecordItem {
    id: string;
    iconsName: string;
    name: string;
}

export const RecordItemComponent: React.FC<{ item: RecordItem, onClick: (id: string) => void, selectedId: string }> = ({ item, onClick, selectedId }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: selectedId === item.id ? "#1976d2" : "text.secondary",
            backgroundColor: selectedId === item.id ? "#e3f2fd" : "transparent",
            padding: 2,
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#e3f2fd",
            },
        }}
        onClick={() => { onClick(item.id ?? "") }}
    >
        {renderIcon(item.iconsName)}
        <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name}
        </Typography>
    </Box>
);