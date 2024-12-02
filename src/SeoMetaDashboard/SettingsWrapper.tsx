import {
  BanIcon,
  BellIcon,
  ChevronLeftIcon,
  CodeIcon,
  CubeIcon,
  DocumentDownloadIcon,
  ExclamationIcon,
  EyeIcon,
  HashtagIcon,
  IdentificationIcon,
  MenuIcon,
  PencilIcon,
  PuzzleIcon,
  ShieldCheckIcon,
  // SparklesIcon,
  StatusOnlineIcon,
  UserGroupIcon,
} from '@heroicons/react/solid'
import {
  CreditCardIcon,
  ViewGridAddIcon,
  UsersIcon,
  ColorSwatchIcon,
  HomeIcon,
  LockClosedIcon,
  CollectionIcon,
  // PencilIcon,
  TagIcon,
  MapIcon,
  RefreshIcon,
  ArrowUpIcon,
  MailIcon,
  TerminalIcon,
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Link from '@/components/CustomLink'
import { cn } from '@/lib/utils'

const subNavigation = [
  { name: 'Branding', href: '', icon: ColorSwatchIcon, category: 'general' },
  { name: 'Team Members', href: '/team', icon: UsersIcon, category: 'general' },
  { name: 'Pricing Plans', href: '/pricing', icon: CreditCardIcon, category: 'general' },
  { name: 'Privacy', href: '/accessibility', icon: EyeIcon, category: 'general' },
  { name: 'Custom Domain', href: '/custom-domain', icon: HomeIcon, category: 'distribution' },
  { name: 'Emails', href: '/email', icon: MailIcon, category: 'distribution' },
  { name: 'Feedback', href: '/boards', icon: CollectionIcon, category: 'modules' },
  // { name: 'Customization', href: '/customize', icon: SparklesIcon, category: 'board' },
  { name: 'Statuses', href: '/statuses', icon: StatusOnlineIcon, category: 'posts' },
  { name: 'Tags', href: '/tags', icon: TagIcon, category: 'posts' },
  // { name: 'Typography', href: '/typography', icon: PencilIcon, category: 'board' },
  { name: 'Voting', href: '/voting', icon: ArrowUpIcon, category: 'posts' },
  { name: 'Custom Fields', href: '/custom-fields', icon: PuzzleIcon, category: 'posts' },
  { name: 'Roadmap', href: '/roadmap', icon: MapIcon, category: 'modules' },
  { name: 'Changelog', href: '/changelog', icon: RefreshIcon, category: 'modules' },
  { name: 'Notifications', href: '/notifications', icon: BellIcon, category: 'board' },
  { name: 'API', href: '/api', icon: TerminalIcon, category: 'board' },
  {
    name: 'Import / Export',
    href: '/import-export',
    icon: DocumentDownloadIcon,
    category: 'board',
  },
  { name: 'Integrations', href: '/integrations', icon: ViewGridAddIcon, category: 'board' },
  { name: 'SSO', href: '/sso', icon: LockClosedIcon, category: 'distribution' },
  {
    name: 'Identity Verification',
    href: '/identity-verification',
    icon: IdentificationIcon,
    category: 'distribution',
  },
  // { name: 'Embed Board', href: '/embed-board', icon: CodeIcon, category: 'distribution' },
  // { name: 'Customize Emails', href: '/customize-emails', icon: MailIcon, category: 'board' },
  {
    name: 'Moderation & Permissions',
    href: '/permissions',
    icon: ShieldCheckIcon,
    category: 'posts',
  },
  {
    name: 'Widgets',
    href: '/widget',
    icon: CubeIcon,
    category: 'distribution',
    beta: true,
  },
  // { name: 'Authentication', href: '/games-auth', icon: LoginIcon, category: 'board' },
  { name: 'User Roles', href: '/roles', icon: UserGroupIcon, category: 'board' },
  { name: 'Banned Users', href: '/banned-users', icon: BanIcon, category: 'board' },
  {
    name: 'Prioritization',
    href: '/prioritization',
    icon: (props: any) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        {...props}
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 2.005c-.777 0 -1.508 .367 -1.971 .99l-5.362 6.895c-.89 1.136 -.89 3.083 0 4.227l5.375 6.911a2.457 2.457 0 0 0 3.93 -.017l5.361 -6.894c.89 -1.136 .89 -3.083 0 -4.227l-5.375 -6.911a2.446 2.446 0 0 0 -1.958 -.974z"
          strokeWidth="0"
          fill="currentColor"
        />
      </svg>
    ),
    category: 'posts',
  },
  {
    name: 'Help center',
    href: '/help-center',
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
      </svg>
    ),
    category: 'modules',
  },
  {
    name: 'Customize/disable Modules',
    href: '/portal-menu',
    icon: MenuIcon,
    category: 'modules',
  },
  {
    name: 'Danger Zone',
    href: '/danger-zone',
    icon: ExclamationIcon,
    category: 'board',
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export const SettingsView: React.FC = () => {
  const router = useRouter()

  const MenuEntry: React.FC<{
    title: string
    item?: any
    link: string
    mobile?: boolean
  }> = ({ title, item, link, mobile = false }) => {
    let isActive = router.pathname === '/dashboard/settings' + link

    if (router.pathname.includes('/widget/') && link.includes('/widget')) {
      isActive = true
    }

    return (
      <>
        <Link legacyBehavior href={'/dashboard/settings' + link}>
          <a
            className={cn(
              ' border-transparent',
              isActive
                ? 'dark:bg-secondary dark:border-border text-gray-600 dark:text-white bg-white border border-gray-100 shadow-sm  '
                : 'text-gray-400 hover:bg-white hover:shadow dark:hover:border-border hover:border-gray-100 dark:text-foreground dark:hover:text-gray-100 dark:hover:bg-secondary/50',
              'border py-1 mt-px px-2 pl-2 -ml-[26px] group main-transition rounded-md flex items-center text-sm font-medium'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {title === 'Discord Bot' ? (
              <svg
                className={classNames(
                  isActive
                    ? 'text-background-accent dark:text-foreground'
                    : 'text-background-accent/70 dark:text-background-accent dark:group-hover:text-background-accent',
                  'flex-shrink-0 -ml-1 mr-2 h-3.5 w-3.5'
                )}
                viewBox="0 -28.5 256 256"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <path
                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </g>
              </svg>
            ) : (
              <item.icon
                className={classNames(
                  isActive
                    ? 'text-background-accent dark:text-foreground'
                    : 'text-background-accent/70 dark:text-background-accent dark:group-hover:text-background-accent',
                  'flex-shrink-0 -ml-1 mr-2 h-3.5 w-3.5'
                )}
                aria-hidden="true"
              />
            )}

            <span className="truncate">{title}</span>
          </a>
        </Link>
      </>
    )
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-6">
          <Link legacyBehavior href="/dashboard/posts">
            <button className="inline-block p-1.5 mr-3 dashboard-secondary">
              <ChevronLeftIcon className="w-4 h-4 " />
            </button>
          </Link>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-white">Settings</h3>
        </div>
        <nav className="ml-10 space-y-1 ">
          <div className="relative">
            <p className="uppercase  -ml-9 text-[11px] text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-2">
              Organization
            </p>
            {subNavigation.map(
              (item) =>
                item.category === 'general' && (
                  <MenuEntry link={item.href} title={item.name} item={item} key={item.name} />
                )
            )}
          </div>
          <p className="uppercase -ml-9 text-[11px] pt-2.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-2">
            Distribution
          </p>
          {subNavigation.map(
            (item) =>
              item.category === 'distribution' && (
                <MenuEntry link={item.href} title={item.name} item={item} key={item.name} />
              )
          )}
          <p className="uppercase -ml-9 text-[11px] pt-2.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-2">
            Posts
          </p>
          {subNavigation.map(
            (item) =>
              item.category === 'posts' && (
                <MenuEntry link={item.href} title={item.name} item={item} key={item.name} />
              )
          )}
          <p className="uppercase -ml-9 text-[11px] pt-2.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-2">
            Modules
          </p>
          {subNavigation.map(
            (item) =>
              item.category === 'modules' && (
                <MenuEntry link={item.href} title={item.name} item={item} key={item.name} />
              )
          )}
          <p className="uppercase -ml-9 text-[11px] pt-2.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-2">
            Other
          </p>
          {subNavigation.map(
            (item) =>
              item.category === 'board' && (
                <MenuEntry link={item.href} title={item.name} item={item} key={item.name} />
              )
          )}
        </nav>
      </div>
      <div className="mt-3 space-y-3">
        <a
          href="https://help.featurebase.app/en/help/articles/2796697-install-featurebase"
          target="_blank"
          rel="noreferrer"
        >
          <div className="relative p-3 border rounded-md shadow-sm cursor-pointer bg-gradient-to-br main-transition hover:bg-gray-100/60 dark:hover:bg-border from-transparent to-gray-50 dark:from-border/30 dark:to-secondary dark:border-border">
            <CodeIcon className="absolute right-3 h-[18px] w-[18px] text-gray-200 dark:text-foreground/60 top-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-50">
              Integrating Featurebase?
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-foreground">
              Explore our Developer Docs to easily connect it with your app.
            </p>
          </div>
        </a>
        <div>
          <a href="https://discord.gg/9wFwqHW4HZ" target="_blank" rel="noreferrer">
            <div className="relative p-3 border border-indigo-100 rounded-md shadow-sm cursor-pointer bg-gradient-to-br main-transition hover:bg-indigo-100/60 dark:hover:bg-indigo-500/10 from-transparent to-indigo-50 dark:from-indigo-500/10 dark:to-transparent dark:border-indigo-400/10">
              <svg
                className="absolute right-3 h-[18px] w-[18px] text-indigo-300 dark:text-indigo-200/60 top-3"
                viewBox="0 -28.5 256 256"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <path
                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                    fill="currentColor"
                    fillRule="nonzero"
                  ></path>
                </g>
              </svg>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-50">
                Join our community
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-indigo-100">
                Get help from our team and freely share your ideas.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
const SettingsWrapper: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({
  children,
  wide,
}) => {
  const router = useRouter()
  const checkIfSettingsPricing = router.pathname.includes('settings/pricing')

  return (
    <div className="">
      <div
        className={`${
          checkIfSettingsPricing ? 'max-w-5xl' : wide ? 'max-w-7xl' : 'max-w-3xl'
        } mx-auto`}
      >
        {children}
      </div>
    </div>
  )
}

export default SettingsWrapper

// <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
//         <section aria-labelledby="payment-details-heading">
//           <form action="#" method="POST">
//             <div className="sm:rounded-md sm:overflow-hidden">
//               <div className="px-4 py-6 bg-gray-800 sm:p-6">
//                 <div>
//                   <h2
//                     id="payment-details-heading"
//                     className="text-lg font-medium leading-6 text-white"
//                   >
//                     Payment details
//                   </h2>
//                   <p className="mt-1 text-sm text-gray-200">
//                     Update your billing information. Please note that updating your location could
//                     affect your tax rates.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-4 gap-6 mt-6">
//                   <div className="col-span-4 sm:col-span-2">
//                     <label htmlFor="first-name" className="block text-sm font-medium text-gray-100">
//                       First name
//                     </label>
//                     <input
//                       type="text"
//                       name="first-name"
//                       className="mt-1"
//                       id="first-name"
//                       autoComplete="cc-given-name"
//                     />
//                   </div>

//                   <div className="col-span-4 sm:col-span-2">
//                     <label htmlFor="first-name" className="block text-sm font-medium text-gray-100">
//                       Last name
//                     </label>
//                     <input
//                       type="text"
//                       name="last-name"
//                       id="last-name"
//                       autoComplete="cc-family-name"
//                       className="mt-1"
//                     />
//                   </div>

//                   <div className="col-span-4 sm:col-span-2">
//                     <label
//                       htmlFor="email-address"
//                       className="block text-sm font-medium text-gray-100"
//                     >
//                       Email address
//                     </label>
//                     <input
//                       type="text"
//                       name="email-address"
//                       id="email-address"
//                       autoComplete="email"
//                       className="mt-1"
//                     />
//                   </div>

//                   <div className="col-span-4 sm:col-span-1">
//                     <label
//                       htmlFor="expiration-date"
//                       className="block text-sm font-medium text-gray-100"
//                     >
//                       Expration date
//                     </label>
//                     <input
//                       type="text"
//                       name="expiration-date"
//                       id="expiration-date"
//                       autoComplete="cc-exp"
//                       className="mt-1"
//                       placeholder="MM / YY"
//                     />
//                   </div>

//                   <div className="col-span-4 sm:col-span-1">
//                     <label
//                       htmlFor="security-code"
//                       className="flex items-center text-sm font-medium text-gray-100"
//                     >
//                       <span>Security code</span>
//                       <QuestionMarkCircleIcon
//                         className="flex-shrink-0 w-5 h-5 ml-1 text-background-accent"
//                         aria-hidden="true"
//                       />
//                     </label>
//                     <input
//                       type="text"
//                       name="security-code"
//                       id="security-code"
//                       autoComplete="cc-csc"
//                       className="mt-1"
//                     />
//                   </div>

//                   <div className="col-span-4 sm:col-span-2">
//                     <label htmlFor="country" className="block text-sm font-medium text-gray-100">
//                       Country
//                     </label>
//                     <select
//                       id="country"
//                       name="country"
//                       autoComplete="country-name"
//                       className="mt-1"
//                     >
//                       <option>United States</option>
//                       <option>Canada</option>
//                       <option>Mexico</option>
//                     </select>
//                   </div>

//                   <div className="col-span-4 sm:col-span-2">
//                     <label
//                       htmlFor="postal-code"
//                       className="block text-sm font-medium text-gray-100"
//                     >
//                       ZIP / Postal code
//                     </label>
//                     <input
//                       type="text"
//                       name="postal-code"
//                       id="postal-code"
//                       autoComplete="postal-code"
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="px-4 py-3 text-right bg-secondary/50 sm:px-6">
//                 <button
//                   type="submit"
//                   className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </form>
//         </section>
//       </div>
