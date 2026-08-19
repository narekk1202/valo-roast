import { SearchIcon } from 'lucide-react';

import { HudFrame } from '@/shared/components/layout/hud-frame';
import { Field, FieldLabel } from '@/shared/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/shared/components/ui/input-group';
import { landingCopy } from '@/shared/content/landing';

type RiotIdFieldProps = {
	id?: string;
	label?: string;
	defaultValue?: string;
	placeholder?: string;
	disabled?: boolean;
};

function RiotIdField({
	id = 'riot-id',
	label = landingCopy.riotIdLabel,
	defaultValue = landingCopy.riotIdSample,
	placeholder = 'Name#TAG',
	disabled = false,
}: RiotIdFieldProps) {
	return (
		<Field data-disabled={disabled || undefined}>
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
						disabled={disabled}
					/>
					<InputGroupAddon align='inline-end'>
						<SearchIcon aria-hidden />
					</InputGroupAddon>
				</InputGroup>
			</HudFrame>
		</Field>
	);
}

export { RiotIdField };
