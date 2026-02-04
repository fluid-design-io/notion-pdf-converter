import { IconMinus, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

type StepperProps = {
	value: number;
	onChange: (value: number) => void;
	step?: number;
	min?: number;
	max?: number;
	format?: (value: number) => string;
	parse?: (value: string) => number | null;
	className?: string;
	inputClassName?: string;
	disabled?: boolean;
};

function clamp(value: number, min?: number, max?: number) {
	if (typeof min === "number" && value < min) return min;
	if (typeof max === "number" && value > max) return max;
	return value;
}

function Stepper({
	value,
	onChange,
	step = 1,
	min,
	max,
	format,
	parse,
	className,
	inputClassName,
	disabled,
}: StepperProps) {
	const displayValue = format ? format(value) : String(value);

	const handleChange = (next: number) => {
		onChange(clamp(next, min, max));
	};

	return (
		<div className={cn("flex", className)}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="border border-border hover:bg-background"
				onClick={() => handleChange(value - step)}
				disabled={disabled}
				aria-label="Decrease value"
			>
				<IconMinus className="size-3" strokeWidth={2.5} />
			</Button>
			<Input
				value={displayValue}
				onChange={(event) => {
					const raw = event.target.value;
					const parsed = parse ? parse(raw) : Number(raw);
					if (Number.isFinite(parsed)) {
						if (parsed !== null) {
							handleChange(parsed);
						}
					}
				}}
				inputMode="decimal"
				className={cn("border-transparent text-center", inputClassName)}
				disabled={disabled}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="border border-border hover:bg-background"
				onClick={() => handleChange(value + step)}
				disabled={disabled}
				aria-label="Increase value"
			>
				<IconPlus className="size-3" strokeWidth={2.5} />
			</Button>
		</div>
	);
}

export { Stepper };
