import { DateTime, Interval } from 'luxon';

export 	const getDaysAgo = (date: string) => {
	const dateTime = DateTime.fromMillis(parseInt(date, 10));
	const currentDateTime = DateTime.now();

	const i = Interval.fromDateTimes(dateTime, currentDateTime);

	const days = Math.floor(i.length('days'));
	if (days === 1) {
		return 'a day';
	}

	if (days < 1) {
		const hours = Math.floor(i.length('hours'));
		if (hours === 1) {
			return 'an hour';
		}

		if (hours < 1) {
			const minutes = Math.floor(i.length('minutes'));
			if (hours === 1) {
				return 'a minute';
			}

			if (minutes < 1) {
				return 'just now';
			}

			return `${minutes} minutes`;
		}

		return `${hours} hours`;
	}

	return `${days} days`;
};
