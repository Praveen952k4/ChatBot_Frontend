export function EmptyChatScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-3xl font-bold mb-2">How can I help you today?</h1>
      <p className="text-muted-foreground">
        Start a conversation by typing a message below.
      </p>
    </div>
  );
}