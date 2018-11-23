import React from 'react';
import { shallow } from 'enzyme';
import Actor from './Actor';

const actor = {
    character: 'Charactor Name',
    name: 'Actor Name',
    profile_path: '/feD4iQF7dug3oZDLYZgXBscJ1gM.jpg'
};

it('should render Actor correctly', () => {
    const wrapper = shallow(<Actor actor={actor}/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('.rmdb-actor-name').text()).toEqual(actor.name);
    expect(wrapper.find('.rmdb-actor-character').text()).toEqual(actor.character);
});
