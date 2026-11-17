from collections import OrderedDict, deque
from math import ceil
from threading import Lock
from time import monotonic

from fastapi import HTTPException, status


class GuestRateLimiter:

    def __init__(
        self,
        *,
        max_requests: int = 5,
        window_seconds: int = 600,
        max_clients: int = 5000,
    ) -> None:

        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.max_clients = max_clients

        self._requests: OrderedDict[
            str, deque[float]
        ] = OrderedDict()

        self._lock = Lock()

    def check(self, client_key: str) -> None:

        now = monotonic()
        cutoff = now - self.window_seconds

        with self._lock:

            events = self._requests.get(client_key)

            if events is None:

                if len(self._requests) >= self.max_clients:
                    self._requests.popitem(last=False)

                events = deque()
                self._requests[client_key] = events

            else:
                self._requests.move_to_end(client_key)

            while events and events[0] <= cutoff:
                events.popleft()

            if len(events) >= self.max_requests:

                retry_after = max(
                    1,
                    ceil(
                        self.window_seconds
                        - (now - events[0])
                    ),
                )

                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=(
                        "Guest analysis limit reached. "
                        "Please try again later."
                    ),
                    headers={
                        "Retry-After": str(retry_after)
                    },
                )

            events.append(now)


guest_rate_limiter = GuestRateLimiter()
