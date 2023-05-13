import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

export const humanize = (
	duration: number,
	durationType: durationPlugin.DurationUnitType = 'seconds'
): string => {
	return dayjs.duration(duration, durationType).humanize();
};
