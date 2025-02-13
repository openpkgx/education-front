import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const UnderConstruction = () => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: 4,
                    borderRadius: 2,
                    backgroundColor: 'white',
                }}
            >
                <ConstructionIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" color="textPrimary">
                    页面正在建设中
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    我们正在努力为您打造更好的体验，请稍后再来！
                </Typography>
            </Box>
        </Container>
    );
};

export default UnderConstruction;