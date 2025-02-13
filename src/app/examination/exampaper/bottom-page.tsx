'use client';
import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Question } from '@/api/dto';

interface BottomPageProps {
  questionDetails: Question;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
}
export default function BottomPage({ questionDetails, onPreviousQuestion, onNextQuestion }: BottomPageProps) {
  const [openAnalysis, setOpenAnalysis] = useState<boolean>(false);

  return (
    <div>
      <div className="flex w-full flex-row justify-between items-center mt-4 mb-4 pr-4 pl-4">
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          startIcon={<ArrowBackIcon />}
          className="w-[200px]"
          onClick={() => { setOpenAnalysis(false); onPreviousQuestion() }}
        >
          上一题
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          onClick={() => { setOpenAnalysis(!openAnalysis) }}
          startIcon={<RemoveRedEyeOutlinedIcon />}
          className="w-[200px] mx-auto"
        >
          查看解析
        </Button>
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          className="w-[200px]"
          onClick={() => { setOpenAnalysis(false); onNextQuestion() }}
        >
          下一题
        </Button>
      </div>
      {openAnalysis && (
        <div className="flex flex-col justify-start mt-12 p-4">
          <Typography variant="h6">答案解析：</Typography>
          <div className='mt-2' dangerouslySetInnerHTML={{ __html: questionDetails.analysis }} />
        </div>
      )}
    </div>
  )
}
