import { Link, Outlet, useParams } from 'react-router-dom';
import { fetchEvent } from '../../util/http.js';
import { useQuery } from '@tanstack/react-query';
import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useMutation } from '@tanstack/react-query';
import { deleteEvent } from '../../util/http.js';
export default function EventDetails() {
  const params = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  // const { mutate, isPending, isError, error } = useMutation({
  //   mutationFn: deleteEvent(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['events'] }); // any key includes events
  //     navigate('/events');
  //   },
  // });

  const handleDeleteClick = () => {
    // mutate(id);
  };

  let content;

  if (isPending) {
    content = (
      <div id="event-details-contnet" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }
  if (isError) {
    <div id="event-details-contnet" className="center">
      <ErrorBlock
        title="Failed to load event..."
        message={
          error.info?.message ||
          'Failed to fetch event data, please try again later.'
        }
      />
    </div>;
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDeleteClick}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate}@{data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
