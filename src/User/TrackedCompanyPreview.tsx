import React from 'react'
import { Description } from './UsersInfo'
import { OfficeBuildingIcon } from '@heroicons/react/solid'
import { ICustomerCompany } from '@/interfaces/IUser'

const TrackedCompanyPreview: React.FC<{
  company: ICustomerCompany
}> = ({ company }) => {
  return (
    <div className="relative -mx-4 overflow-hidden group md:mx-0">
      <div className="-mb-2 ">
        <div className="text-sm text-gray-500 border-t divide-y dark:text-foreground dark:shadow border-gray-100/50 dark:border-border divide-gray-100/50 dark:divide-dark-accent">
          <div key={company.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between ">
              <p className="flex items-center space-x-2 text-sm font-semibold text-gray-500 dark:text-gray-100 first-letter:capitalize">
                <OfficeBuildingIcon className="secondary-svg mr-1.5" />
                {company.name}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex-shrink-0 font-medium w-28">CompanyID</p>
              <Description content={company.id} />
            </div>
            {company.monthlySpend ? (
              <div className="flex items-center justify-between">
                <p className="flex-shrink-0 font-medium w-28">Company MRR</p>
                <Description content={`$${company.monthlySpend} MRR`} />
              </div>
            ) : null}
            {company.customFields
              ? Object.entries(company.customFields).map(([key, value]) => {
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <p className="flex-shrink-0 font-medium truncate w-28 first-letter:uppercase">
                        {key}
                      </p>
                      <Description content={`${value}`} />
                    </div>
                  )
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackedCompanyPreview
