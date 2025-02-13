import React from 'react'
import UserTable from './user-table'
import UserSearchBar from './user-search'

export default function UserPage() {
  return (
    <div className='flex flex-col items-start gap-2'>
      <UserSearchBar></UserSearchBar>
      <UserTable></UserTable>
    </div >
  )
}
