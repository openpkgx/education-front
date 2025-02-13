import { Topic } from "@/api/dto";
import { renderIcon } from "@/components/utils";
import { Box, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import { colors } from '@mui/material';

export const TopicItemComponent: React.FC<{ item: Topic, onClick: (id: string) => void, selectedId: string }> = ({ item, onClick, selectedId }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: selectedId === item.id ? "#fff" : "#030712",
            backgroundColor: selectedId === item.id ? alpha(colors.blue[700], 0.7) : "transparent",
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