from __future__ import absolute_import

from sentry.testutils import TestCase

from sentry.utils.sentryappwebhookrequests import SentryAppWebhookRequestsBuffer


class TestSentryAppWebhookRequests(TestCase):
    def setUp(self):
        self.sentry_app = self.create_sentry_app(
            name="Test App", events=["issue.resolved", "issue.ignored", "issue.assigned"]
        )

        self.buffer = SentryAppWebhookRequestsBuffer(self.sentry_app)

    def test_only_100_entries_in_buffer(self):
        for i in range(100):
            self.buffer.add_request(200, i, "issue.assigned", "https://example.com/hook")

        requests = self.buffer.get_requests()
        assert len(requests) == 100
        assert requests[0]["organization_id"] == 99
        assert requests[99]["organization_id"] == 0

        self.buffer.add_request(500, 100, "issue.assigned", "https://test.com/hook")

        requests = self.buffer.get_requests()
        assert len(requests) == 100
        assert requests[0]["organization_id"] == 100
        assert requests[0]["response_code"] == 500
        assert requests[99]["organization_id"] == 1
        assert requests[99]["response_code"] == 200
