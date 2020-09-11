/*@import "{require('react-toggle-switch/dist/css/switch.min.css')}";*/

export const Switch = `
	.switch {
		border: 1px solid #ccc;
		width: 50px;
		height: 26px;
		border-radius: 13px;
		cursor: pointer;
		display: inline-block;
	}
	.switch-toggle {
		border: 1px solid #999;
		box-shadow: 1px 1px 1px #ccc;
		width: 25px;
		height: 24px;
		left: 0;
		border-radius: 12px;
		background: #fff;
		position: relative;
		transition: left 0.2s ease-in-out;
	}
	.switch.on {
		background: green;
	}
	.switch.on .switch-toggle {
		left: 23px;
	}
	.switch.disabled {
		cursor: not-allowed;
	}

	.switch {
		background: #bdbdbd;
		width: 44px;
		height: 22px;
		border-radius: 11px;
		vertical-align: top;
	}
	.switch.on {
		background: #2cc510;
	}

	.switch .switch-toggle {
		width: 20px;
		height: 20px;
		left: 1px;
		top: 1px;
		border-radius: 10px;
	}

	.switch.on .switch-toggle {
		left: 23px;
	}
`;
