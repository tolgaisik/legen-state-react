import "./App.css";
import {
	Observable,
	ObservableArray,
	ObservableObject,
	ObservablePrimitiveBaseFns,
	observable,
	observe,
} from "@legendapp/state";
import {
	For,
	observer,
	useObservable,
	Memo,
	Reactive,
	enableLegendStateReact,
} from "@legendapp/state/react";
import { Legend } from "@legendapp/state/react-components";
import React from "react";
enableLegendStateReact();

type Todo = {
	id: number;
	text: string;
	completed: boolean;
	date: Date;
};

const defaultList: Todo[] = [];

const todos$ = observable(defaultList);

const App = function Component() {
	const todoText$ = useObservable("");
	const handleClick = () => {
		const todo = {
			id: todos$.length + 1,
			text: todoText$.get(),
			completed: false,
			date: new Date(),
		};
		todos$.push(todo);
	};

	const handleDelete = (id: number) => {
		const reducedTodos = todos$.get().filter((todo) => todo.id !== id);
		todos$.set(reducedTodos);
	};

	const handleComplete = (id: number) => {
		todos$.forEach((todo) => {
			if (todo.id.get() === id) {
				todo.completed.set(!todo.completed.get());
			}
		});
	};
	return (
		<>
			<h1>Todo List</h1>
			<div className='flex flex-row p-4'>
				<Legend.input
					type='text'
					placeholder='Add todo'
					onChange={(e) => todoText$.set(e.target.value)}
					className='rounded'
					value$={() => todoText$.get()}
				/>
				<button onClick={handleClick}>Add</button>
			</div>
			<div>
				<For
					each={todos$}
					item={TodoItem}
					itemProps={{ handleDelete, handleComplete }}
				/>
			</div>
		</>
	);
};
export default App;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = observer(function Component({ ...props }: InputProps) {
	return <input {...props} />;
});

type TodoItemProps = {
	item: ObservablePrimitiveBaseFns<Todo | undefined>;
	id?: string | undefined;
} & {
	handleDelete: (id: number) => void;
	handleComplete: (id: number) => void;
};

const TodoItem = ({ item, handleDelete, handleComplete }: TodoItemProps) => {
	return (
		<>
			<div className='flex flex-row p-4 gap-4'>
				<div className='flex flex-row text-center justify-center items-center gap-4'>
					<Legend.input
						type='checkbox'
						checked$={() => item.get()?.completed}
						name=''
						id=''
						onChange={() => handleComplete(item.get()?.id as number)}
					/>
					<span>{item.get()?.text}</span>
				</div>
				<div>
					<button onClick={() => handleDelete(item.get()?.id as number)}>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};
