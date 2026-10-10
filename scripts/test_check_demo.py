import io
import unittest
from datetime import timedelta
from unittest.mock import Mock

from check_demo import BASE_URL, DEADLINE, check_demo


def response(status="ok", http_status=200):
    body = io.BytesIO(('{"status":"' + status + '"}').encode())
    body.status = http_status
    return body


class DemoMonitorTests(unittest.TestCase):
    def test_both_endpoints_and_get_only(self):
        opener = Mock(side_effect=[response(), response("ready")])
        self.assertEqual(check_demo(lambda: DEADLINE - timedelta(days=1), opener), (False, []))
        self.assertEqual([call.args[0].full_url for call in opener.call_args_list],
                         [BASE_URL + "/health", BASE_URL + "/ready"])
        self.assertTrue(all(call.args[0].get_method() == "GET" for call in opener.call_args_list))

    def test_one_cold_start_retry(self):
        opener = Mock(side_effect=[TimeoutError(), response(), response("ready")])
        sleep = Mock()
        self.assertEqual(check_demo(lambda: DEADLINE - timedelta(days=1), opener, sleep), (False, []))
        self.assertEqual(opener.call_count, 3)
        sleep.assert_called_once_with(5)

    def test_persistent_bad_status_is_failure(self):
        opener = Mock(side_effect=[response("down"), response("down"), response("ready")])
        self.assertEqual(check_demo(lambda: DEADLINE - timedelta(days=1), opener, Mock()),
                         (False, ["/health"]))

    def test_non_200_is_failure(self):
        opener = Mock(side_effect=[response(http_status=503), response(http_status=503), response("ready")])
        self.assertEqual(check_demo(lambda: DEADLINE - timedelta(days=1), opener, Mock()),
                         (False, ["/health"]))

    def test_no_requests_at_or_after_deadline(self):
        for now in (DEADLINE, DEADLINE + timedelta(days=365)):
            opener = Mock()
            self.assertEqual(check_demo(lambda: now, opener), (True, []))
            opener.assert_not_called()

    def test_deadline_between_requests_stops_retry(self):
        opener = Mock(side_effect=TimeoutError())
        now = Mock(side_effect=[DEADLINE - timedelta(seconds=1), DEADLINE, DEADLINE])
        self.assertEqual(check_demo(now, opener, Mock()), (True, []))
        self.assertEqual(opener.call_count, 1)


if __name__ == "__main__":
    unittest.main()
