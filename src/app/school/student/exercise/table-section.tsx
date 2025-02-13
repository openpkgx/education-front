import { ExamPaperSample } from "@/api/dto";
import { Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TablePagination } from "@mui/material";
import Link from "next/link";

export const TableSection: React.FC<{
    rows: ExamPaperSample[],
    topicId: string,
    title: string,
    page: number,
    rowsPerPage: number,
    totalSize: number,
    handleChangePage: (event: any, newPage: number) => void,
    handleChangeRowsPerPage: (event: any) => void,
    handleResetExamPaperRequestQuestion: (examId: string, topicId: string, tagId: string) => void
}> = ({ rows, topicId, title, page, rowsPerPage, totalSize, handleChangePage, handleChangeRowsPerPage, handleResetExamPaperRequestQuestion }) => {
    const percentage = (correctScore: number, totalScore: number) => {
        return ((correctScore / totalScore) * 100).toFixed(1);
    }

    console.log(`TableSection rows: ${rows.length}`)
    return (
        <Box sx={{ mx: "auto" }}>
            <Paper sx={{ p: 2 }} elevation={0}>
                <TableContainer>
                    <Table sx={{ border: "none" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: "none" }}>{title}</TableCell>
                                <TableCell sx={{ border: "none" }}>已做题数/总题数</TableCell>
                                <TableCell sx={{ border: "none" }}>得分/总分</TableCell>
                                <TableCell sx={{ border: "none" }}>正确率</TableCell>
                                <TableCell sx={{ border: "none" }} align="right">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index} sx={{
                                    '&:hover': {
                                        backgroundColor: '#e6f5ff', // 鼠标划过时的背景颜色
                                        cursor: 'pointer', // 可选：改变鼠标指针为手型
                                    },
                                    '& .MuiTableCell-root': {
                                        padding: "6px 16px",
                                        lineHeight: 2.0,
                                    },
                                }}>
                                    {/* <TableRow key={index} sx={{
                                        '& .MuiTableCell-root': {
                                            padding: "6px 16px",
                                            lineHeight: 1.2,
                                        },
                                    }}> */}
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.answeredCount}/{row.totalCount}</TableCell>
                                    <TableCell>{row.correctScore}/{row.totalScore}</TableCell>
                                    <TableCell>{percentage(row.correctScore, row.totalScore)}%</TableCell>
                                    <TableCell align="right">
                                        {row.answeredCount > 0 ? (
                                            <div className="flex flex-row gap-2">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => { handleResetExamPaperRequestQuestion(row.id as string, topicId, row.tagId) }}
                                                >
                                                    {"重新做题"}
                                                </Button>
                                                <Link href={`/examination/exampaper?id=${row.id}`} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="contained" color="primary" size="small">
                                                        {"继续做题"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : row.answeredCount === 0 ? (
                                            <Link href={`/examination/exampaper?id=${row.id}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="contained" color="primary" size="small">
                                                    {"开始做题"}
                                                </Button>
                                            </Link>
                                        ) : null}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* 分页 */}
                <TablePagination
                    component="div"
                    count={totalSize}
                    page={page}
                    labelRowsPerPage="每页大小"
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};