import clsx from 'clsx';

interface Props {
  active: boolean;
  color?: string;
}

export default function SoundWave({ active, color = '#D4A847' }: Props) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height: 28 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full transition-all duration-200',
            active ? `bar-${i}` : ''
          )}
          style={{
            width: 3,
            height: active ? undefined : 4,
            backgroundColor: color,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
