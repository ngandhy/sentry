import React from 'react';
import styled from 'react-emotion';
import {Location} from 'history';

import {t} from 'app/locale';
import {Event, Organization} from 'app/types';
import PageHeading from 'app/components/pageHeading';
import BetaTag from 'app/components/betaTag';
import Link from 'app/components/links/link';

import EventView from './eventView';

type Props = {
  eventView: EventView | undefined;
  event: Event | undefined;
  organization: Organization;
  location: Location;
};
class DiscoverBreadcrumb extends React.Component<Props> {
  static defaultProps = {
    eventView: undefined,
    event: undefined,
  };

  getCrumbs = (): React.ReactNode => {
    const {eventView, event} = this.props;
    const crumbs: React.ReactNode[] = [];

    if (eventView && eventView.isValid()) {
      crumbs.push(<span>{' \u2014 '}</span>);
      crumbs.push(<span>{eventView.name}</span>);
    }

    if (event) {
      let eventType = event.type;
      eventType = eventType.charAt(0).toUpperCase() + eventType.slice(1);

      crumbs.push(<span>{' \u2014 '}</span>);
      crumbs.push(<span>{t(`${eventType} Event Detail`)}</span>);
    }

    return crumbs;
  };

  render() {
    const {organization, location} = this.props;

    // TODO: move this somewhere
    const query = location.query;
    delete query.field;
    delete query.fieldnames;
    delete query.tag;
    delete query.sort;
    delete query.name;
    delete query.query;

    const target = {
      pathname: `/organizations/${organization.slug}/eventsv2/`,
      query,
    };

    return (
      <PageHeading>
        <Link to={target}>{t('Discover')}</Link>
        <BetaTagWrapper>
          <BetaTag />
        </BetaTagWrapper>
        {this.getCrumbs()}
      </PageHeading>
    );
  }
}

const BetaTagWrapper = styled('span')`
  margin-right: 0.4em;
`;

export default DiscoverBreadcrumb;
