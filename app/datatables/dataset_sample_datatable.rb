class DatasetSampleDatatable < ApplicationDatatable
  private

  def data
    samples.map do |sample|
      [].tap do |column|
        column << ""
        @config.each do |attr|
          if attr != 'id'
            column << "<div class='table_cell'> #{sample[attr]} </div>"
          else
            column << sample[attr]
          end
        end
        project_id = Sample.find(sample['id']).project_id
        column << link_to('Show', "/projects/#{project_id}/samples/#{sample['id']}") 
      end
    end
  end

  def count
    samples.length()
  end

  def total_entries
    @obj.length()
    # will_paginate
    # users.total_entries
  end

  def samples
      fetch_samples
  end

  def fetch_samples
    if @obj.length == 0
      return @obj
    end
    search_string = []
    obj_start = (page-1) * per_page
    obj_end = obj_start + per_page
    if sort_direction == "asc"
      @obj = @obj.sort_by { |s_record| s_record[sort_column] }
    else
      @obj = @obj.sort_by { |s_record| s_record[sort_column] }.reverse!

    end
    #samples = @obj.slice(obj_start, per_page)
    if params[:search][:value] != ""
      search_values = params[:search][:value]
      # @obj.each do |s_record|
      samples = []
      @obj.each do |s_record|
        @config.each do |attr|
          if s_record[attr].to_s.include? search_values.to_s
            samples.push(s_record)
          end
        end
      end
      samples = samples.slice(obj_start, per_page)
    else
      samples = @obj.slice(obj_start, per_page)
    end
    #samples = samples.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
  end

  def columns
    @config
    # %w(first_name last_name email phone_number)
  end

  def sort_column
    columns[params[:order]['0'][:column].to_i - 1]
  end

  # def sort_direction
  #   params[:order]['0'][:dir] == "desc" ? "desc" : "asc"
  # end

end
