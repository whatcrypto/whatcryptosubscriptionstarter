import { ICustomerCompany } from '@/interfaces/IUser'
import { getCompanyById } from 'network/lib/organization'
import React, { useMemo, useState } from 'react'

const CompanyFilterDisplayer: React.FC<{ id: string }> = ({ id }) => {
  const [company, setCompany] = useState<ICustomerCompany | null>(null)

  useMemo(() => {
    if (!company || company.id !== id) {
      const fetchCompany = async () => {
        try {
          const res = await getCompanyById(id)
          setCompany(res.data.company)
        } catch (error) {
          console.error('Error fetching company:', error)
          setCompany(null)
        }
      }
      fetchCompany()
    }
  }, [id])

  return (
    <p className="flex items-center select-none max-w-[350px] truncate font-medium dark:font-semibold">
      {company?.name ?? 'Loading...'}
    </p>
  )
}

export default CompanyFilterDisplayer
