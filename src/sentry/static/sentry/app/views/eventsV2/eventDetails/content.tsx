import React from 'react';
import {Params} from 'react-router/lib/Router';
import DocumentTitle from 'react-document-title';
import {Location} from 'history';

import {t} from 'app/locale';
import {Client} from 'app/api';
import withApi from 'app/utils/withApi';
import {getTitle} from 'app/utils/events';
import {Organization, Event} from 'app/types';

import EventView from '../eventView';

type Props = {
  organization: Organization;
  location: Location;
  params: Params;
  api: Client;
};

type State = {
  isLoading: boolean;
  error: null | string;
  event: Event | undefined;
};

class EventDetailsContent extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    error: null,
    event: undefined,
  };

  getEventSlug = (): string => {
    const {eventSlug} = this.props.params;

    if (typeof eventSlug === 'string') {
      return eventSlug.trim();
    }

    return '';
  };

  getEventView = (): EventView => {
    const {location} = this.props;

    return EventView.fromLocation(location);
  };

  fetchData = () => {
    this.setState({isLoading: true});

    const {organization, location} = this.props;
    const eventView = this.getEventView();
    const eventSlug = this.getEventSlug();

    const query = eventView.getEventsAPIPayload(location);
    const url = `/organizations/${organization.slug}/events/${eventSlug}/`;

    this.props.api
      .requestPromise(url, {
        method: 'GET',
        includeAllArgs: true,
        query,
      })
      .then(([data, _, _jqXHR]) => {
        this.setState({
          isLoading: false,
          error: null,
          event: data,
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          error: err.responseJSON.detail,
        });
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  getDocumentTitle = ({
    eventTitle,
    eventViewName,
  }: {
    eventTitle: string;
    eventViewName: string | undefined;
  }): Array<string> => {
    return typeof eventViewName === 'string' && String(eventViewName).trim().length > 0
      ? [eventTitle, String(eventViewName).trim(), t('Discover')]
      : [eventTitle, t('Discover')];
  };

  render() {
    if (this.state.isLoading) {
      // TODO: flesh out
      return 'loading';
    }

    if (this.state.error) {
      // TODO: flesh out
      return 'error';
    }

    const {event} = this.state;

    if (!event) {
      // TODO: flesh out
      return 'no event';
    }

    const {organization} = this.props;
    const {title} = getTitle(event);
    const eventView = this.getEventView();

    const documentTitle = this.getDocumentTitle({
      eventTitle: title,
      eventViewName: eventView.name,
    }).join(' - ');

    console.log('event', event);

    return (
      <DocumentTitle title={`${documentTitle} - ${organization.slug} - Sentry`}>
        <span>content</span>
      </DocumentTitle>
    );
  }
}

export default withApi(EventDetailsContent);
