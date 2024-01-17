import { getUserImgSrc } from '@/app/utils/misc'
import { Button } from '@/app/comps/ui/button'
import { Icon } from '@/app/comps/ui/_icon'
import Link from 'next/link'

import { getLoggedInUser } from '@/app/utils/auth'

export default async function EditUserProfile() {
	const user = await getLoggedInUser()

	return (
		<div className="flex flex-col gap-12">
			<div className="flex justify-center">
				<div className="relative h-52 w-52">
					<img
						src={getUserImgSrc(user?.image?.id)}
						alt={user?.username ?? ''}
						className="h-full w-full rounded-full object-cover"
					/>
					<Button
						asChild
						variant="outline"
						className="absolute -right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full p-0"
					>
						<Link
							href="photo"
							title="Change profile photo"
							aria-label="Change profile photo"
						>
							<Icon name="camera" className="h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>
			{/* <UpdateProfile /> */}

			<div className="col-span-6 my-6 h-1 border-b-[1.5px] border-foreground" />
			<div className="col-span-full flex flex-col gap-6">
				<div>
					<Link href="change-email">
						<Icon name="envelope-closed">
							{/* Change email from {data.user.email} */}
						</Icon>
					</Link>
				</div>
				<div>
					<Link href="two-factor">
						{/* {data.isTwoFAEnabled ? (
							<Icon name="lock-closed">2FA is enabled</Icon>
						) : (
							<Icon name="lock-open-1">Enable 2FA</Icon>
						)} */}
					</Link>
				</div>
				<div>
					{/* <Link href={data.hasPassword ? 'password' : 'password/create'} >
						<Icon name="dots-horizontal">
							{data.hasPassword ? 'Change Password' : 'Create a Password'}
						</Icon>
					</Link> */}
				</div>
			</div>
		</div>
	)
}
