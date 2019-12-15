import { Step, StepType, BaseStepConfig, StepConfig } from '../Step'
import { createStep, UnknownStepTypeError, Failable, fail, succeed } from '../utils'

export interface TimelineStepConfig {
  duration: number
  step: StepConfig
}

export interface TimelineConfig extends BaseStepConfig {
  activeStep?: string
  stepType: StepType.TIMELINE
  steps: TimelineStepConfig[]
}

export interface TimelineStep {
  step: Step
  duration: number
}

export class TimelineInitialisationError extends Error {
  name = 'TimelineInitialisationError'

  constructor(config: TimelineConfig, errors: UnknownStepTypeError[]) {
    super(
      [
        `Error initialising the timeline ${config.id} due to errors in the following steps:`,
        ...errors.map(stepErr => {
          const { config: stepConfig, message } = stepErr
          return `  ${stepConfig.id} (${stepConfig.stepType}):\t${message}`
        })
      ].join('\n')
    )
  }
}

export class Timeline extends Step<StepType.TIMELINE> {
  activeStep: string

  stepType: StepType.TIMELINE = StepType.TIMELINE

  steps: TimelineStep[] = []

  constructor({ steps, activeStep, ...config }: TimelineConfig) {
    super(config)

    const addStepsResult = this.addSteps(steps)

    if (addStepsResult.isFailure) {
      throw new TimelineInitialisationError({ steps, ...config }, addStepsResult.errors)
    }

    this.activeStep = activeStep ?? this.steps[0].step.id
  }

  addSteps(childConfig: TimelineStepConfig[]): Failable<never, UnknownStepTypeError> {
    const errors: UnknownStepTypeError[] = []

    for (const { step, duration } of childConfig) {
      const createResult = createStep(step)

      if (createResult.isSuccess) {
        this.steps.push({
          duration,
          step: createResult.value
        })
      } else {
        errors.push(...createResult.errors)
      }
    }

    if (errors.length > 0) {
      return fail(errors)
    }

    return succeed()
  }
}
