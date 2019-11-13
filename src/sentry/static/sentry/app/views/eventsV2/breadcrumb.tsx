import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import {Event} from 'app/types';
import PageHeading from 'app/components/pageHeading';
import BetaTag from 'app/components/betaTag';

import EventView from './eventView';

type Props = {
  eventView: EventView | undefined;
  event: Event | undefined;
};
class DiscoverBreadcrumb extends React.Component<Props> {
  static defaultProps = {
    eventView: undefined,
    event: undefined,
  };

  getCrumbs = (): React.ReactNode => {
    const {eventView, event} = this.props;
    const crumbs: React.ReactNode[] = [];

    if (eventView) {
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
    return (
      <PageHeading>
        {t('Discover')}
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
