'use client'

import { useState } from 'react'
import SignUpForm from '@/app/comps/signup-form'
import VerifyForm from '@/app/comps/verify-form'

export default function SignupRoute() {
	const [verify, showVerify] = useState<boolean>(false)

	return verify ? <VerifyForm /> : <SignUpForm showVerify={showVerify} />
}
