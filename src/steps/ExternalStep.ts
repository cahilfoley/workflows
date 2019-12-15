import { Step, StepType, BaseStepConfig } from '../Step'

export interface ExternalStepConfig extends BaseStepConfig {
  stepType: StepType.EXTERNAL
}

export class ExternalStep extends Step<StepType.EXTERNAL> {
  stepType: StepType.EXTERNAL = StepType.EXTERNAL

  constructor({ ...config }: ExternalStepConfig) {
    super(config)
  }
}
