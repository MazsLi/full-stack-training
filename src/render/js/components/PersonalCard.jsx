import React from 'react';

class PersonalCard extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			name: null,
			title: null,
			description: null,
			numOfFriend: null,
			joinDate: null,
			src: null,
		}

	}

	componentWillMount = () => {

		// 將Parent傳下來的參數設定到自己參數內
		const personData = this.props.personData;
		if( personData ) this.setState( personData );

	}

	componentWillUnmount = () => {

	}

	componentDidMount = () => {

	}

	onChange = () => {

	}

	/**
	 * class 要改成 className 
	 */
	render() {
		
		return (
			
			<div className="ui card">
				<div className="image">
					<img src={ this.state.src }/>
				</div>
				<div className="content">
					<div className="header"> {this.state.name} </div>
					<div className="meta"> {this.state.title} </div>
					<div className="description"> {this.state.description} </div>
				</div>
				<div className="extra content">
					<span className="right floated"> {this.state.joinDate} </span>
					<span>
						<i className="user icon"></i>
						{this.state.numOfFriend}
					</span>
				</div>
		 	</div>

		);
	}
}

export default PersonalCard;
