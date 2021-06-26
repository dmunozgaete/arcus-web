import React from 'react';
import { Select, Spin, Tag, TagProps } from 'antd';
import { TeamOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import { debounce, filter } from 'lodash';
import ActorClient, { IActor } from '../../clients/ActorClient';
import { LabeledValue } from 'antd/lib/select';
import Expr from '../../lib/Expr';
const Option = Select.Option;

interface IProps {
  actors?: IActor[];
  placeholder: string;
  onChange?: (value: IActor[]) => void;
}

interface IState {
  data: IActor[];
  actors: IActor[];
  fetching: boolean;
}

export default class ActorSelector extends React.Component<IProps, IState> {
  lastFetchId = 0;
  state: IState = {
    data: [],
    actors: this.props.actors || [],
    fetching: false
  }

  constructor(props: IProps) {
    super(props);
  }

  fetchActors = debounce(async (terms: string): Promise<void> => {
    this.lastFetchId += 1;
    this.setState({ fetching: true });

    const fetchId = this.lastFetchId;
    const response = await ActorClient.getAll(0, 10);

    if (fetchId !== this.lastFetchId) { // for fetch callback order
      return;
    }

    this.setState({
      data: response.data
    })
  }, 800);

  handleChange = (selectedValues: LabeledValue[]) => {
    const { actors, data } = this.state;
    const { onChange } = this.props;

    selectedValues.forEach((selected) => {
      const finded = actors.find((a) => a.id === selected.key);
      if (!finded) {
        // find the the last data fetched
        const newActorSelected = data.find((d) => d.id === selected.key);
        actors.push(newActorSelected!);
      }
    });

    const actorsToRemove: string[] = [];
    actors.forEach((actor: IActor) => {
      const finded = selectedValues.find((a) => a.key === actor.id);
      if (!finded) {
        // remove from the actor, because was removed via "close" on the tag
        actorsToRemove.push(actor.id)
      }
    });

    const newActors = actors.filter((actor) => {
      return !(actorsToRemove.indexOf(actor.id) >= 0);
    })

    Expr.whenNotUndefined(onChange, () => {
      onChange!(newActors)
    })
    
    this.setState({
      actors:newActors,
      data: [],
      fetching: false,
    });
  }

  onRemoveOption = (actorToRemove: IActor) => {
    const { actors } = this.state;
    const newActors = filter(actors, a => a !== actorToRemove);

    this.setState({
      actors: newActors,
      data: [],
      fetching: false
    })
  }

  render() {
    const { fetching, data, actors } = this.state;
    const values: LabeledValue[] = actors.map((actor) => {
      return {
        label: <span>{actor.name}</span>,
        value: actor.id
      }
    })

    return (
      <Select
        mode="multiple"
        labelInValue
        value={values}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        showSearch={true}
        showArrow={false}
        placeholder={this.props.placeholder}
        onSearch={this.fetchActors}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        tagRender={(props) => {
          const actor: IActor = actors.find(a => a.id === props.value)!;

          return <Tag
            hidden={false}
            color={(() => {
              switch (actor.type) {
                case "ROLE": return "processing";
                case "TAG": return "warning";
                case "USER": return "success";
              }
            })()}
            closable={props.closable}
            onClose={(e) => { this.onRemoveOption(actor); props.onClose(e); }}
            style={{ marginRight: 3, display: "block" }}
          >
            {actor.type === "ROLE" ? <TeamOutlined /> : null}
            {actor.type === "TAG" ? <NumberOutlined /> : null}
            {actor.type === "USER" ? <UserOutlined /> : null}
            &nbsp;{actor.name}
          </Tag>
        }}
      >
        {data.map((d: IActor) => <Option key={d.id} value={d.id}>{d.name}</Option>)}
      </Select>
    );
  }
}