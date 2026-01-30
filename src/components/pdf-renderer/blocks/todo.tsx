import { Path, type SVGProps, Svg, View } from "@react-pdf/renderer";
import { RichText } from "../rich-text";
import type { BlockStyles } from "../styles";
import type { BlockByType } from "../types";

type TodoBlockProps = {
	block: BlockByType<"to_do">;
	styles: BlockStyles;
};

const TodoUnchecked = (props: SVGProps) => (
	<Svg viewBox="0 0 24 24" {...props}>
		<Path stroke="none" d="M0 0h24v24H0z" />
		<Path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
	</Svg>
);

const TodoChecked = (props: SVGProps) => (
	<Svg viewBox="0 0 24 24" {...props}>
		<Path stroke="none" d="M0 0h24v24H0z" />
		<Path d="m9 11 3 3 8-8" />
		<Path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
	</Svg>
);

export function TodoBlock({ block, styles }: TodoBlockProps) {
	const todo = block.to_do;
	const isChecked = todo.checked;
	const checkbox = isChecked ? (
		<TodoChecked
			style={styles.todoCheckbox}
			stroke={styles.todoCheckbox.color}
		/>
	) : (
		<TodoUnchecked
			style={styles.todoCheckbox}
			stroke={styles.todoCheckbox.color}
		/>
	);

	return (
		<View style={styles.todoItem} wrap>
			{checkbox}
			<View style={styles.todoContent}>
				<RichText
					richText={todo.rich_text}
					style={[
						styles.todoContent,
						isChecked ? styles.todoContentChecked : {},
					]}
					linkStyle={styles.link}
					codeStyle={styles.code}
				/>
			</View>
		</View>
	);
}
