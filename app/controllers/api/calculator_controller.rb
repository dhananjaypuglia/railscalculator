class Api::CalculatorController < ApiController

  def create
    unless current_user.calculator
      Calculator.create({:state => 0, :user_id => current_user.id})
      head 201
    else
      head 200
    end
  end

  def calculate
    if current_user
    unless current_user.calculator
      head 404
    else
      calculator = current_user.calculator
      parser = Parser.new(calculator)
      parser.perform_operation(params[:command]) unless params[:command].nil?
      render :json => {:state => calculator.state}
    end
    else
      head 401
    end
  end
  end

