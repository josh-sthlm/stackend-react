
import { media } from '../style-common/media';

/* Can not use sc, since this is not within the .stackend selector */
export const Subsite = `
	.stackend-site .stackend-site {

		.stackend-site-wrapper {
			display: flex;
		}

		&.stackend-menu-horizontal {
			.stackend-site-wrapper {
				flex-direction: column;
			}
		}

		&.stackend-menu-vertical {
			.stackend-site-wrapper {
				flex-direction: row;

				${media.tabletScreen} {
					flex-direction: column;
				}

				.stackend-menu-container {
					flex: 0 0 auto;
				}

				.stackend-page {
					flex: 1 1 auto;
				}
			}
		}

	}
`;
