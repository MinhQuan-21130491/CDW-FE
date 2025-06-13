import React from 'react'
import {  Button, CircularProgress } from '@mui/material'
import { green } from '@mui/material/colors'

export const MyButton = ({text, loading, input}) => {
  return (
    <Button
        type="submit"
        className="relative w-full text-white"
        sx={{
            bgcolor: green[600],
            '&:hover': {
            bgcolor: green[700],
            },
        }}
        variant="contained"
        disabled={input === "" || loading}
        >
        {loading ? (
            <>
            <CircularProgress
                size={24}
                sx={{
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
                }}
            />
            <span className="opacity-0">Đang xử lý</span>
            </>
        ) : (
            text
        )}
    </Button>
  )
}
