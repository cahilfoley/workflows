import { StepConfig, StepType, Step } from '../Step'
import { Timeline } from '../timeline/Timeline'
import { ExternalStep } from '../steps/ExternalStep'
import { Failable, succeed, fail } from './failable'

export class UnknownStepTypeError extends Error {
  name = 'UnknownStepTypeError'

  config: StepConfig

  constructor(config: StepConfig) {
    super(`Unable to initialise the step ${config.id} of type ${config.stepType}`)
    this.config = config
  }
}

export const createStep = (config: StepConfig): Failable<Step, UnknownStepTypeError> => {
  switch (config.stepType) {
    case StepType.TIMELINE:
      return succeed(new Timeline(config))

    case StepType.EXTERNAL:
      return succeed(new ExternalStep(config))

    default:
      return fail(new UnknownStepTypeError(config))
  }
}
