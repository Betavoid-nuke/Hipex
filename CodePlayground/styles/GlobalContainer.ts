import styled from 'styled-components';

const GlobalContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;

	@media only screen and (max-width: 768px) {
		display: none;
	}
`;

export default GlobalContainer;
