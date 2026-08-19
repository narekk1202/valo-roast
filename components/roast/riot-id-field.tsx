import { SearchIcon } from 'lucide-react'

import { HudFrame } from '@/components/layout/hud-frame'
import { Field, FieldLabel } from '@/components/ui/field'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { landingCopy } from '@/content/landing'

type RiotIdFieldProps = {
	id?: string
	label?: string
	defaultValue?: string
	placeholder?: string
}

function RiotIdField({
	id = 'riot-id',
	label = landingCopy.riotIdLabel,
	defaultValue = landingCopy.riotIdSample,
	placeholder = 'Name#TAG',
}: RiotIdFieldProps) {
	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<HudFrame>
				<InputGroup className='h-12'>
					<InputGroupInput
						id={id}
						name='riotId'
						defaultValue={defaultValue}
						placeholder={placeholder}
						autoComplete='off'
						spellCheck={false}
					/>
					<InputGroupAddon align='inline-end'>
						<SearchIcon aria-hidden />
					</InputGroupAddon>
				</InputGroup>
			</HudFrame>
		</Field>
	)
}

export { RiotIdField }
