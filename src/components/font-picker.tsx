"use client";

import * as React from "react";

import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import {
	Picker,
	PickerContent,
	PickerGroup,
	PickerRadioGroup,
	PickerRadioItem,
	PickerSeparator,
	PickerTrigger,
} from "@/components/ui/picker";

import type { FontType } from "@/lib/fonts";

export function FontPicker({
	fonts,
	value,
	onChange,
}: {
	fonts: readonly FontType[];
	value: string;
	onChange: (value: string) => void;
}) {
	const currentFont = fonts.find((font) => font.family === value);

	return (
		<div className="group/picker relative">
			<Picker>
				<PickerTrigger className="rounded-none md:rounded-none md:border-border">
					<div className="flex flex-col justify-start text-left">
						<div className="text-muted-foreground text-xs">Font</div>
						<div className="font-medium text-foreground text-sm">
							{currentFont?.family}
						</div>
					</div>
					<div
						className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 select-none items-center justify-center text-base text-foreground"
						style={{ fontFamily: currentFont?.family }}
					>
						Aa
					</div>
				</PickerTrigger>
				<PickerContent
					// anchor={isMobile ? anchorRef : undefined}
					// side={isMobile ? "top" : "right"}
					// align={isMobile ? "center" : "start"}
					className="max-h-80 rounded-none p-0 md:w-74"
				>
					<PickerRadioGroup
						value={currentFont?.family}
						onValueChange={(value) => {
							onChange(value);
						}}
					>
						<PickerGroup>
							{fonts.map((font, index) => (
								<React.Fragment key={font.family}>
									<PickerRadioItem value={font.family} className="rounded-none">
										<Item size="xs">
											<ItemContent className="gap-1">
												<ItemTitle className="font-medium text-muted-foreground text-xs">
													{font.family}
												</ItemTitle>
												<ItemDescription style={{ fontFamily: font.family }}>
													Designers love packing quirky glyphs into test
													phrases.
												</ItemDescription>
											</ItemContent>
										</Item>
									</PickerRadioItem>
									{index < fonts.length - 1 && (
										<PickerSeparator className="opacity-50" />
									)}
								</React.Fragment>
							))}
						</PickerGroup>
					</PickerRadioGroup>
				</PickerContent>
			</Picker>
		</div>
	);
}
