export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span>ReqNexa AI is typing</span>
      <span className="flex items-center gap-1">
        <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
        <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
      </span>
    </div>
  );
}
