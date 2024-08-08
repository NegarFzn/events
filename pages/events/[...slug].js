import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Head from "next/head";

import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

export default function FilteredEventsPage() {
  const [loadedEvents, setLoadedEvents] = useState([]);
  const router = useRouter();
  const filterData = router.query.slug;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    "https://nextjs-course-36669-default-rtdb.firebaseio.com/events.json",
    fetcher
  );

  useEffect(() => {
    if (data) {
      const events = [];
      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }
      setLoadedEvents(events);
    }
  }, [data]);

 
  let title = "Filtered Events";
  let description = "Find a list of filtered events";

  if (filterData) {
    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (
      !isNaN(numYear) &&
      !isNaN(numMonth) &&
      numYear <= 2030 &&
      numYear >= 2021 &&
      numMonth >= 1 &&
      numMonth <= 12
    ) {
      title = `Events for ${filteredMonth}/${filteredYear}`;
      description = `All events for ${filteredMonth}/${filteredYear}`;
    }
  }

  if (!data && !error) {
    return (
      <>
        <Head>
          <title>Loading...</title>
          <meta name="description" content="Loading events list" />
        </Head>
        <p className="center">Loading...</p>
      </>
    );
  }

  const filteredYear = filterData ? filterData[0] : null;
  const filteredMonth = filterData ? filterData[1] : null;

  const numYear = filteredYear ? +filteredYear : null;
  const numMonth = filteredMonth ? +filteredMonth : null;

  if (
    !filterData ||
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
    return (
      <>
        <Head>
          <title>Invalid filter - NextEvents</title>
          <meta
            name="description"
            content="Invalid filter specified for events list."
          />
        </Head>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <>
        <Head>
          <title>No events found - NextEvents</title>
          <meta
            name="description"
            content={`No events found for ${numMonth}/${numYear}.`}
          />
        </Head>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </>
  );
}

/* export async function getServerSideProps(context) {
  const filterData = context.params.slug;

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return {
      props: { hasError: true },
     
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
} */
