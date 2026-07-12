import { useEffect, useState } from 'preact/hooks';

function RollingDigit({ digit, delay }: { digit: string; delay: number }) {
	const isNumber = /\d/.test(digit);
	if (!isNumber) return <span class="rolling-separator">{digit}</span>;

	const num = parseInt(digit);

	return (
		<span class="rolling-digit" style={{ animationDelay: `${delay}ms` }}>
			<span class="rolling-digit__strip" style={{
				transform: `translateY(-${num * 10}%)`,
				animationDelay: `${delay}ms`,
			}}>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
					<span key={n}>{n}</span>
				))}
			</span>
		</span>
	);
}

export default function VisitorCounter() {
	const [count, setCount] = useState<string | null>(null);

	useEffect(() => {
		const callbackName = '__gc_counter';
		(window as any)[callbackName] = (data: any) => {
			setCount(data.count ?? '0');
			delete (window as any)[callbackName];
			script.remove();
		};

		const script = document.createElement('script');
		script.src = `https://thecorezi.goatcounter.com/counter/TOTAL.json?callback=${callbackName}`;
		script.onerror = () => {
			delete (window as any)[callbackName];
			script.remove();
			setCount('0');
		};
		document.body.appendChild(script);
	}, []);

	if (count === null) return null;

	const chars = count.split('');

	return (
		<p class="visitor-counter">
			Eres el visitante{' '}
			<span class="rolling-counter">
				{chars.map((char, i) => (
					<RollingDigit key={i} digit={char} delay={i * 100} />
				))}
			</span>
		</p>
	);
}
