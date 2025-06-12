
export const formatRelativeTime = (isoTimestamp: string): string => {
  const now = new Date();
  const then = new Date(isoTimestamp);
  const diffInSeconds = Math.round((now.getTime() - then.getTime()) / 1000);

  const minutes = Math.round(diffInSeconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};
