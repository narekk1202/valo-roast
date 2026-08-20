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
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: string | null;
};

function RiotIdField({
	id = 'riot-id',
	label = landingCopy.riotIdLabel,
	value = landingCopy.riotIdSample,
	onValueChange,
	placeholder = 'Narek#03270624',
	disabled = false,
	error = null,
}: RiotIdFieldProps) {
	return (
		<Field data-disabled={disabled || undefined}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<HudFrame>
				<InputGroup className='h-12'>
					<InputGroupInput
						id={id}
						name='riotId'
						value={value}
						onChange={event => onValueChange?.(event.target.value)}
						placeholder={placeholder}
						autoComplete='off'
						spellCheck={false}
						disabled={disabled}
						maxLength={22}
						aria-invalid={error ? true : undefined}
						aria-describedby={error ? 'riot-id-error' : undefined}
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
